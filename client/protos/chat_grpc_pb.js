// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var chat_pb = require('./chat_pb.js');

function serialize_GuildFriendsChat_RequestJoin(arg) {
  if (!(arg instanceof chat_pb.RequestJoin)) {
    throw new Error('Expected argument of type GuildFriendsChat.RequestJoin');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GuildFriendsChat_RequestJoin(buffer_arg) {
  return chat_pb.RequestJoin.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GuildFriendsChat_RequestSend(arg) {
  if (!(arg instanceof chat_pb.RequestSend)) {
    throw new Error('Expected argument of type GuildFriendsChat.RequestSend');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GuildFriendsChat_RequestSend(buffer_arg) {
  return chat_pb.RequestSend.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GuildFriendsChat_ResponseJoin(arg) {
  if (!(arg instanceof chat_pb.ResponseJoin)) {
    throw new Error('Expected argument of type GuildFriendsChat.ResponseJoin');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GuildFriendsChat_ResponseJoin(buffer_arg) {
  return chat_pb.ResponseJoin.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GuildFriendsChat_ResponseSend(arg) {
  if (!(arg instanceof chat_pb.ResponseSend)) {
    throw new Error('Expected argument of type GuildFriendsChat.ResponseSend');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GuildFriendsChat_ResponseSend(buffer_arg) {
  return chat_pb.ResponseSend.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChatServiceService = exports.ChatServiceService = {
  join: {
    path: '/GuildFriendsChat.ChatService/join',
    requestStream: false,
    responseStream: false,
    requestType: chat_pb.RequestJoin,
    responseType: chat_pb.ResponseJoin,
    requestSerialize: serialize_GuildFriendsChat_RequestJoin,
    requestDeserialize: deserialize_GuildFriendsChat_RequestJoin,
    responseSerialize: serialize_GuildFriendsChat_ResponseJoin,
    responseDeserialize: deserialize_GuildFriendsChat_ResponseJoin,
  },
  send: {
    path: '/GuildFriendsChat.ChatService/send',
    requestStream: true,
    responseStream: true,
    requestType: chat_pb.RequestSend,
    responseType: chat_pb.ResponseSend,
    requestSerialize: serialize_GuildFriendsChat_RequestSend,
    requestDeserialize: deserialize_GuildFriendsChat_RequestSend,
    responseSerialize: serialize_GuildFriendsChat_ResponseSend,
    responseDeserialize: deserialize_GuildFriendsChat_ResponseSend,
  },
};

exports.ChatServiceClient = grpc.makeGenericClientConstructor(ChatServiceService);
