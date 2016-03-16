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

var client = new booksProto.books.BookService('127.0.0.1:50051', grpc.Credentials.createInsecure());

function printResponse(error, response) {
    if (error)
        console.log('Error: ', error);
    else
        console.log(response);
}

function listBooks() {
    client.list({}, function(error, books) {
        printResponse(error, books);
    });
}

function insertBook(id, title, author) {
    var book = {
        id: parseInt(id),
        title: title,
        author: author
    };
    client.insert(book, function(error, empty) {
        printResponse(error, empty);
    });
}

function getBook(id) {
    client.get({
        id: parseInt(id)
    }, function(error, book) {
        printResponse(error, book);
    });
}

function deleteBook(id) {
    client.delete({
        id: parseInt(id)
    }, function(error, empty) {
        printResponse(error, empty);
    });
}

function watchBooks() {
    var call = client.watch({});
    call.on('data', function(book) {
        console.log(book);
    });
}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

if (command == 'list')
    listBooks();
else if (command == 'insert')
    insertBook(process.argv[0], process.argv[1], process.argv[2]);
else if (command == 'get')
    getBook(process.argv[0]);
else if (command == 'delete')
    deleteBook(process.argv[0]);
else if (command == 'watch')
    watchBooks();