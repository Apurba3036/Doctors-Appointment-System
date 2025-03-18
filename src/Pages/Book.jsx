// App.jsx
import { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './book.css';

function Book() {
  const [topic, setTopic] = useState('');
  const [pages, setPages] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookData, setBookData] = useState(null);
  const [pdfBase64, setPdfBase64] = useState('');
  const [showBook, setShowBook] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/generate_book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, pages }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate book');
      }
      
      setBookData(result.book_data);
      setPdfBase64(result.pdf_base64);
      setShowBook(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBase64) return;
    
    const linkSource = `data:application/pdf;base64,${pdfBase64}`;
    const downloadLink = document.createElement('a');
    const fileName = `book-${topic.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return (
    <div className="app-container mt-36">
      <header>
        <h1>AI Book Generator</h1>
        <p>Generate beautiful PDF books on any topic</p>
      </header>
      
      {!showBook ? (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="topic">Book Topic:</label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic for your book"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pages">Minimum Pages:</label>
              <input
                type="number"
                id="pages"
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value))}
                min="3"
                max="15"
              />
            </div>
            
            <button type="submit" disabled={loading} className="generate-btn">
              {loading ? 'Generating...' : 'Generate Book'}
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loader">Generating your book. This may take a few minutes...</div>}
        </div>
      ) : (
        <div className="book-container">
          <div className="book-controls">
            <button onClick={() => setShowBook(false)} className="back-btn">
              Create Another Book
            </button>
            <button onClick={handleDownloadPDF} className="download-btn">
              Download PDF
            </button>
          </div>
          
          <div className="book-viewer">
            <HTMLFlipBook
              width={550}
              height={733}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={420}
              maxHeight={1350}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="demo-book"
            >
              {/* Cover Page */}
              <div className="page cover">
                <div className="page-content">
                  <h1>{bookData.title}</h1>
                  <h2>By {bookData.author}</h2>
                </div>
              </div>
              
              {/* Book Content Pages */}
              {bookData.sections.map((section, index) => (
                <div className="page" key={index}>
                  <div className="page-content">
                    <h2>{section.heading}</h2>
                    <div className="section-content">
                      {section.content.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                    {section.image_data && (
                      <div className="page-image">
                        <img src={section.image_data} alt={section.heading} />
                      </div>
                    )}
                    <div className="page-footer">{index + 1}</div>
                  </div>
                </div>
              ))}
              
              {/* Back Cover */}
              <div className="page cover">
                <div className="page-content">
                  <h2>Thank you for reading</h2>
                  <p>Generated with AI Book Generator</p>
                </div>
              </div>
            </HTMLFlipBook>
          </div>
        </div>
      )}
    </div>
  );
}

export default Book;