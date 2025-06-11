import json
from ..models import  CustomUser
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from ..models import Group, GroupMembership, Message, MessageContent, Reaction
from django.utils import timezone
import os

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.group_name = f'chat_{self.group_id}'
        self.user = self.scope['user']

        # Reject connection for anonymous users
        if isinstance(self.user, AnonymousUser):
            await self.close()
            return

        # Verify group membership
        if not await self.is_group_member():
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        # Update user online status
        await self.set_user_online(True)

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        
        # Update user online status
        await self.set_user_online(False)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'chat_message':
            await self.handle_chat_message(data)
        elif message_type == 'message_read':
            await self.handle_read_receipt(data)
        elif message_type == 'typing':
            await self.handle_typing_indicator(data)
        elif message_type == 'reaction':
            await self.handle_reaction(data)

    async def handle_chat_message(self, data):
        # Create message in database
        message = await self.create_message(data['content'], data.get('files', []))

        # Broadcast message to room group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message': await self.serialize_message(message)
            }
        )

    async def handle_read_receipt(self, data):
        message_id = data['message_id']
        await self.mark_message_as_read(message_id)
        
        # Broadcast read receipt
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'read_receipt',
                'user_id': self.user.id,
                'message_id': message_id,
                'timestamp': str(timezone.now())
            }
        )

    async def handle_typing_indicator(self, data):
        # Broadcast typing indicator
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'is_typing': data['is_typing']
            }
        )

    async def handle_reaction(self, data):
        # Create or update reaction
        reaction = await self.set_reaction(
            data['message_id'], 
            data['reaction_type']
        )
        
        # Broadcast reaction
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'reaction_update',
                'reaction': await self.serialize_reaction(reaction)
            }
        )

    # Database operations
    @database_sync_to_async
    def is_group_member(self):
        return GroupMembership.objects.filter(
            group_id=self.group_id,
            user=self.user
        ).exists()

    @database_sync_to_async
    def set_user_online(self, online):

        CustomUser.objects.filter(id=self.user.id).update(online=online)

    @database_sync_to_async
    def create_message(self, text_content, files):
        # Create message
        message = Message.objects.create(
            sender=self.user,
            group_id=self.group_id
        )
        
        # Create text content if exists
        if text_content:
            MessageContent.objects.create(
                message=message,
                content_type='text',
                content=text_content,
                order=0
            )
        
        # Create file contents
        for i, file_id in enumerate(files, start=1 if text_content else 0):
            MessageContent.objects.create(
                message=message,
                content_type='file',
                file_id=file_id,
                order=i
            )
        
        return message

    @database_sync_to_async
    def mark_message_as_read(self, message_id):
        try:
            message = Message.objects.get(id=message_id)
            message.mark_as_read(self.user)
        except Message.DoesNotExist:
            pass

    @database_sync_to_async
    def set_reaction(self, message_id, reaction_type):
        # Update existing reaction or create new one
        reaction, created = Reaction.objects.update_or_create(
            user=self.user,
            message_id=message_id,
            defaults={'reaction_type': reaction_type}
        )
        return reaction

    # Serialization methods
    @database_sync_to_async
    async def serialize_message(self, message):
        contents = []
        for content in message.contents.all().order_by('order'):
            contents.append({
                'type': content.content_type,
                'content': content.content,
                'file': self.serialize_file(content.file) if content.file else None
            })
        
        return {
            'id': message.id,
            'sender': {
                'id': message.sender.id,
                'username': message.sender.username,
                'profile_picture': message.sender.profile_picture.url if message.sender.profile_picture else None
            },
            'group_id': message.group_id,
            'timestamp': str(message.timestamp),
            'contents': contents,
            'reactions': await self.get_message_reactions(message.id)
        }

    def serialize_file(self, file):
        return {
            'id': file.id,
            'url': file.file.url,
            'type': file.file_type,
            'size': file.file_size,
            'name': os.path.basename(file.file.name)
        }

    @database_sync_to_async
    def get_message_reactions(self, message_id):
        reactions = Reaction.objects.filter(message_id=message_id)
        return [{
            'id': r.id,
            'user_id': r.user_id,
            'reaction_type': r.reaction_type
        } for r in reactions]

    @database_sync_to_async
    def serialize_reaction(self, reaction):
        return {
            'id': reaction.id,
            'message_id': reaction.message_id,
            'user_id': reaction.user_id,
            'reaction_type': reaction.reaction_type,
            'created_at': str(reaction.created_at)
        }

    # Handler methods for different message types
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def read_receipt(self, event):
        await self.send(text_data=json.dumps({
            'type': 'read_receipt',
            'user_id': event['user_id'],
            'message_id': event['message_id'],
            'timestamp': event['timestamp']
        }))

    async def typing_indicator(self, event):
        if event['user_id'] != self.user.id:  # Don't send to self
            await self.send(text_data=json.dumps({
                'type': 'typing_indicator',
                'user_id': event['user_id'],
                'is_typing': event['is_typing']
            }))

    async def reaction_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'reaction_update',
            'reaction': event['reaction']
        }))
