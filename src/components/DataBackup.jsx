import { useRef } from 'react';
import { exportData, importData } from '../services/localApi';

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

const defaultButtonStyle = {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px'
};

export default function DataBackup({ buttonStyle = defaultButtonStyle, gap = '12px' }) {
    const fileInput = useRef(null);

    const handleExport = async () => {
        const fileName = `dicethrone-${new Date().toISOString().slice(0, 10)}.json`;
        const file = new File([exportData()], fileName, { type: 'application/json' });

        // Na tablecie / telefonie arkusz udostępniania pozwala zapisać plik w aplikacji Pliki
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: fileName });
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }

        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;
        if (file.size > MAX_IMPORT_BYTES) {
            alert('File is too large.');
            return;
        }
        if (!window.confirm('Import will replace all current data. Continue?')) return;
        try {
            importData(await file.text());
            alert('Data imported.');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(err instanceof SyntaxError ? 'Invalid data file: not a JSON file' : err.message);
        }
    };

    return (
        <div style={{ display: 'flex', gap }}>
            <button style={buttonStyle} onClick={handleExport}>⬇ Export data</button>
            <button style={buttonStyle} onClick={() => fileInput.current.click()}>⬆ Import data</button>
            <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                style={{ display: 'none' }}
            />
        </div>
    );
}
