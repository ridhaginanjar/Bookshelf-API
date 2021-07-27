const { request } = require("http");
const {nanoid} = require("nanoid");
const books = require("./books");

const addBookHandler = (request,h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    //Jika Nama Tidak Ada
    if(name === undefined) {
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    };

    //Jika readPage lebih dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
        id,
        updatedAt,
        insertedAt,
        finished
    };

    books.push(newBook);

    const isSuccess = books.filter((b)=> b.id === id).length >0;
    if (isSuccess) {
        const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
    };

    const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan",
      });
    response.code(500);
    return response;
};

const getAllBookHandler = (request,h) => {
    let filterBook = books;

    const response = h.response({
        status : "success",
        data : {
            books : filterBook.map((book) => ({
                id : book.id,
                name : book.name,
                publisher : book.publisher
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request,h) => {
    const {bookId} = request.params;

    const book = books.filter((b)=>b.id === bookId)[0];
    if(book !== undefined){
        return {
            status: 'success',
            data: {
              book,
            },
        };
    }
    const response = h.response({
        status : "fail",
        message : "Buku tidak ditemukan"
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    
    //Jika Nama Tidak Ada
    if(name === undefined) {
        const response = h.response({
            status : "fail",
            message : "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    };
    
    //Jika readPage lebih dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status : "fail",
            message : "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    };

    const f_index = books.findIndex((b) => b.id === bookId);

    if (f_index !== -1) {
        books[f_index] = {
        ...books[f_index],
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
        bookId,
        updatedAt,
        insertedAt,
        finished
        };

        const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status : "fail",
        message : "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;


};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const f_index = books.findIndex((b) => b.id === bookId);
   
    if (f_index !== -1) {
      books.splice(f_index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = {addBookHandler, getAllBookHandler,getBookByIdHandler,editBookByIdHandler, deleteBookByIdHandler};