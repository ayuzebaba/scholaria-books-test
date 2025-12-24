import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [name, setName] = useState('');
  const [pages, setPages] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching books:', error);
      alert('Error loading books: ' + error.message);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  };

  // Create/Update book
  const saveBook = async (e) => {
    e.preventDefault();
    
    if (!name || !pages) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    
    if (editingId) {
      // Update
      const { error } = await supabase
        .from('books')
        .update({ name, pages: parseInt(pages) })
        .eq('id', editingId);
      
      if (error) {
        console.error('Error updating book:', error);
        alert('Error updating: ' + error.message);
      } else {
        alert('Book updated successfully!');
        setEditingId(null);
      }
    } else {
      // Create
      const { error } = await supabase
        .from('books')
        .insert([{ name, pages: parseInt(pages) }]);
      
      if (error) {
        console.error('Error creating book:', error);
        alert('Error creating: ' + error.message);
      } else {
        alert('Book added successfully!');
      }
    }

    // Reset form and refresh
    setName('');
    setPages('');
    fetchBooks();
  };

  // Edit book
  const editBook = (book) => {
    setName(book.name);
    setPages(book.pages.toString());
    setEditingId(book.id);
  };

  // Delete book
  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setLoading(true);
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting: ' + error.message);
      } else {
        alert('Book deleted successfully!');
        fetchBooks();
      }
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="App">
      <h1>📚 Scholaria Books CRUD Test</h1>
      <p className="subtitle">Testing React + Supabase integration</p>

      {/* Book Form */}
      <div className="form-container">
        <h2>{editingId ? '✏️ Edit Book' : '➕ Add New Book'}</h2>
        <form onSubmit={saveBook}>
          <div className="form-group">
            <label>Book Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter book name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Number of Pages:</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="Enter number of pages"
              min="1"
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingId ? '📝 Update Book' : '📥 Add Book'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setPages('');
                }}
              >
                ❌ Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Books List */}
      <div className="books-list">
        <h2>📖 Books List ({books.length})</h2>
        
        {loading ? (
          <p className="loading">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="no-books">No books found. Add your first book!</p>
        ) : (
          <div className="table-container">
            <table className="books-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book Name</th>
                  <th>Pages</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td className="book-name">{book.name}</td>
                    <td><span className="pages-badge">{book.pages}</span></td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => editBook(book)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => deleteBook(book.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tech Stack Info */}
      <div className="tech-info">
        <h3>🧪 Testing Technology Stack:</h3>
        <ul>
          <li>✅ React Frontend</li>
          <li>✅ Supabase Backend (PostgreSQL)</li>
          <li>✅ Real-time CRUD Operations</li>
          <li>✅ Environment Variables</li>
          <li>📋 <strong>Next: Add your Supabase credentials in .env.local</strong></li>
        </ul>
      </div>
    </div>
  );
}

export default App;