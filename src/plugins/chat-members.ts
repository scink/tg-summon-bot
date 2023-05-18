import {chatMembers} from '@grammyjs/chat-members';
import {ChatMember} from '@grammyjs/types';
import {StorageAdapterDep} from '../utils/deps';

export const getChatMembersPlugin = ({storageAdapter}: StorageAdapterDep<ChatMember>) => chatMembers(storageAdapter);
