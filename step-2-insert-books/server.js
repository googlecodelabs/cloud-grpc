/*
   Copyright 2016, Google, Inc.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var grpc = require('grpc');

var booksProto = grpc.load('books.proto');

// In-memory array of book objects
var books = [{
    id: 123,
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens'
}];

var server = new grpc.Server();
server.addService(booksProto.books.BookService.service, {
    list: function(call, callback) {
        callback(null, books);
    },
    insert: function(call, callback) {
        books.push(call.request);
        callback(null, {});
    }
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();