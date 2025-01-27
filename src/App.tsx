import { useEffect, useState } from 'react'
import './App.css'
import IconFile from './IconFile'
import IconSearch from './IconSearch'

interface GoogleDriveFile {
  id: string
  name: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [files, setFiles] = useState<GoogleDriveFile[]>([])
  const [debouncedTerm, setDebouncedTerm] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300) 

    return () => {
      clearTimeout(handler) 
    }
  }, [searchTerm])

  useEffect(() => {
    fetchFiles(debouncedTerm)
  }, [debouncedTerm])

  const fetchFiles = async (query:string) => {
    try {
      const response = await fetch(
        `/api/fetch-files?query=${encodeURIComponent(query)}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }
      const data = await response.json()
      setFiles(data.files)
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }
  
  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div className="input relative flex items-center justify-center">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-full"
            type="search"
            value={searchTerm}
            placeholder="Rechercher"
          />
          <IconSearch />
        </div>
      </div>

      <div>
        <ul className="result [&>li>a]:py-4 [&>li]:px-2 [&>li>a]:text-primary-500 [&>li>a.router-link-exact-active]:text-black [&>li]:border-y-stone-100 [&_a]:font-bold [&>li]:border-y-[1px]">
          {files?.map((file, index) => (
            <li className="mt-[-1px]" key={index}>
              <a
                className="flex justify-between gap-4"
                href={`https://drive.google.com/file/d/${file.id}/view`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {file.name}
                <IconFile />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
