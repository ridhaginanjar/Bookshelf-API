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



module.exports = {addBookHandler};