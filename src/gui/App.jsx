import React, { useState } from 'react';

const stacks = [
  { name: 'React', value: 'react' },
  { name: 'Vue', value: 'vue' },
  { name: 'Svelte', value: 'svelte' },
  { name: 'Vanilla', value: 'vanilla' },
];

export default function App() {
  const [selectedStack, setSelectedStack] = useState('react');
  const [options, setOptions] = useState({
    typescript: false,
    tailwind: false,
  });

  const handleOptionChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };

  const handleStackChange = (e) => {
    setSelectedStack(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call backend to generate project files
    alert(`Stack: ${selectedStack}\nTypeScript: ${options.typescript}\nTailwindCSS: ${options.tailwind}`);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>Project Wizard Pro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label><b>Select Stack:</b></label><br />
          {stacks.map((stack) => (
            <label key={stack.value} style={{ marginRight: 16 }}>
              <input
                type="radio"
                name="stack"
                value={stack.value}
                checked={selectedStack === stack.value}
                onChange={handleStackChange}
              />
              {stack.name}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <label>
            <input
              type="checkbox"
              name="typescript"
              checked={options.typescript}
              onChange={handleOptionChange}
            />
            TypeScript
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="tailwind"
              checked={options.tailwind}
              onChange={handleOptionChange}
            />
            TailwindCSS
          </label>
        </div>
        <button type="submit" style={{ marginTop: 32, padding: '8px 24px', fontSize: 16 }}>
          Generate Project
        </button>
      </form>
    </div>
  );
}
