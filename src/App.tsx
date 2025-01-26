import { useState } from 'react';
import './App.css'

interface GoogleDriveFile {
  id: string;
  name: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);

  const fetchFiles = async (query:string) => {
    const folderId = "1Y0zWn74fRmo32APXO1CMSsZ7b_tfR5z4"; // Replace with your actual folder ID
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and fullText contains '${query}'&fields=files(id, name)&key=${process.env.GOOGLE_API_KEY}`
      );
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchFiles(searchTerm);
    }
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Rechercher un cours"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Rechercher
        </button>
      </div>

      <div>
        {files.map((file: any) => (
          <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}>
            <div>
              <p style={{ margin: 0 }}>{file.name}</p>
            </div>
            <a
              href={`https://drive.google.com/file/d/${file.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              Voir le fichier
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App
