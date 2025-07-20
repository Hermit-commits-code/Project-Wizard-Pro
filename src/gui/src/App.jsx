import React, { useState } from 'react';
import './index.css';

const steps = ['Project Name', 'Stack', 'Config', 'Preview', 'Generate'];

const stacks = [
  { name: 'React', value: 'react' },
  { name: 'Node.js', value: 'node' },
  { name: 'Python', value: 'python' },
  { name: 'Vue', value: 'vue' },
];

const configs = [
  { name: 'TypeScript', value: 'typescript' },
  { name: 'ESLint', value: 'eslint' },
  { name: 'Prettier', value: 'prettier' },
  { name: 'Docker', value: 'docker' },
  { name: 'Vite', value: 'vite' },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [selectedStack, setSelectedStack] = useState('react');
  const [selectedConfigs, setSelectedConfigs] = useState([]);
  const [outDir, setOutDir] = useState('');
  const [git, setGit] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const toggleConfig = (value) => {
    setSelectedConfigs((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectDir = async () => {
    if (window.electronAPI) {
      const dir = await window.electronAPI.selectDirectory();
      if (dir) setOutDir(dir);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setSuccess(false);
    if (window.electronAPI) {
      await window.electronAPI.generateProject({
        projectName,
        stack: selectedStack,
        configs: selectedConfigs,
        outDir,
        git,
      });
      setSuccess(true);
    }
    setGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-white">
      <div className="w-full max-w-xl p-8 rounded-2xl shadow-2xl bg-zinc-900/80">
        <div className="flex justify-between mb-8">
          {steps.map((label, i) => (
            <div key={label} className={`flex-1 text-center ${i === step ? 'font-bold text-blue-400' : 'text-zinc-400'}`}>{label}</div>
          ))}
        </div>
        {/* Step 1: Project Name */}
        {step === 0 && (
          <div className="flex flex-col items-center">
            <label className="mb-2 text-lg">Project Name</label>
            <input
              className="p-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-400"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-app"
              autoFocus
            />
          </div>
        )}
        {/* Step 2: Stack Selection */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {stacks.map((stack) => (
              <button
                key={stack.value}
                className={`p-6 rounded-xl shadow-lg transition-all border-2 ${selectedStack === stack.value ? 'border-blue-400 bg-zinc-800' : 'border-zinc-700 bg-zinc-800/60'} hover:border-blue-300`}
                onClick={() => setSelectedStack(stack.value)}
              >
                {stack.name}
              </button>
            ))}
          </div>
        )}
        {/* Step 3: Config Options */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {configs.map((cfg) => (
              <button
                key={cfg.value}
                className={`p-4 rounded-xl shadow border-2 flex items-center gap-2 ${selectedConfigs.includes(cfg.value) ? 'border-blue-400 bg-zinc-800' : 'border-zinc-700 bg-zinc-800/60'} hover:border-blue-300`}
                onClick={() => toggleConfig(cfg.value)}
              >
                <input type="checkbox" checked={selectedConfigs.includes(cfg.value)} readOnly />
                {cfg.name}
              </button>
            ))}
          </div>
        )}
        {/* Step 4: Preview */}
        {step === 3 && (
          <div>
            <h2 className="text-xl mb-2">Project Summary</h2>
            <div className="mb-2">Name: <b>{projectName}</b></div>
            <div className="mb-2">Stack: <b>{selectedStack}</b></div>
            <div className="mb-2">Configs: <b>{selectedConfigs.join(', ') || 'None'}</b></div>
            <div className="mb-2">Output Directory: <b>{outDir || <span className="text-red-400">Not selected</span>}</b></div>
            <div className="mb-2 flex items-center gap-2">
              <input type="checkbox" checked={git} onChange={e => setGit(e.target.checked)} id="git-init" />
              <label htmlFor="git-init">Initialize Git repository</label>
            </div>
            <button className="mt-2 px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600" onClick={handleSelectDir}>
              {outDir ? 'Change Directory' : 'Select Output Directory'}
            </button>
          </div>
        )}
        {/* Step 5: Generate */}
        {step === 4 && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl mb-4">Ready to Generate!</h2>
            <button
              className="px-6 py-2 bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-40"
              onClick={handleGenerate}
              disabled={generating || !outDir}
            >
              {generating ? 'Generating...' : 'Generate Project'}
            </button>
            {success && <div className="mt-4 text-green-400">Project generated successfully!</div>}
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button onClick={prev} disabled={step === 0} className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40">Back</button>
          <button onClick={next} disabled={step === steps.length - 1} className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-40">Next</button>
        </div>
      </div>
      {/* TODO: Add dark/light theme toggle, animated transitions, and micro-interactions */}
    </div>
  );
}
