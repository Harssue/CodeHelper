import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import axios from 'axios';

const languageExtensions = {
    python: python(),
    javascript: javascript(),
    cpp: cpp(),
};

function CodeEditor() {
  const [code, setCode] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('python');
  const [darkMode, setDarkMode] = useState(true);
  const [mode, setMode] = useState('generate');

  const handleSend = async () => {
    let finalPrompt = code;

    if (mode==='explain'){
        finalPrompt = `Explain this ${language} code:\n${code}`;
    }
    else if (mode==='refactor'){
        finalPrompt = `Refactor this ${language} code for readability and efficiency:\n${code}`;
    }

    try {
      const res = await axios.post('http://localhost:8000/generate', {
        prompt: finalPrompt,
      });
      setResponse(res.data.output || res.data.error);
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  return (
    <div style={{
      padding: '1rem',
      background: darkMode ? '#121212' : '#ffffff',
      minHeight: '100vh',
      color: darkMode ? '#fff' : '#000'
    }}>
      <h2>Offline Code Assistant</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="generate">Generate</option>
            <option value="explain">Explain</option>
            <option value="refactor">Refactor</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          Dark Mode
        </label>
      </div>

      <h3>Input Code:</h3>
      <CodeMirror
        value={code}
        height="300px"
        theme={darkMode ? oneDark : 'light'}
        extensions={[languageExtensions[language]]}
        onChange={(val) => setCode(val)}
      />

      <button onClick={handleSend} style={{ marginTop: '1rem' }}>Run</button>

      <h3 style={{ marginTop: '2rem' }}>Output:</h3>
      <CodeMirror
        value={response}
        height="300px"
        theme={darkMode ? oneDark : 'light'}
        editable={false}
        extensions={[languageExtensions[language]]}
      />
    </div>
  );
}

export default CodeEditor;