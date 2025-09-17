// This function assumes pdf.js is loaded globally via a script tag in index.html
declare const pdfjsLib: any;

interface ProgressUpdate {
  type: 'reading' | 'parsing';
  loaded: number;
  total: number;
}

export const extractTextFromFile = async (
  file: File,
  onProgress: (update: ProgressUpdate) => void,
  signal: AbortSignal
): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name;

  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      const abortHandler = () => {
        reader.abort();
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal.addEventListener('abort', abortHandler);

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress({ type: 'reading', loaded: event.loaded, total: event.total });
        }
      };

      reader.onload = (event) => {
        signal.removeEventListener('abort', abortHandler);
        resolve(event.target?.result as string);
      };

      reader.onerror = (error) => {
        signal.removeEventListener('abort', abortHandler);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    if (typeof pdfjsLib === 'undefined' || !pdfjsLib.getDocument) {
        throw new Error('PDF.js library is not loaded. Please check the network connection and refresh.');
    }
    
    // Configure the workerSrc just-in-time to avoid race conditions.
    // Check if it's already set to avoid unnecessary re-assignments.
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js';
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      const abortHandler = () => {
        reader.abort();
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal.addEventListener('abort', abortHandler);

      reader.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress({ type: 'reading', loaded: event.loaded, total: event.total });
          }
      };

      reader.onload = async (event) => {
        try {
          if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
          const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            
            onProgress({ type: 'parsing', loaded: i, total: pdf.numPages });
            
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          signal.removeEventListener('abort', abortHandler);
          resolve(fullText);
        } catch (error) {
            signal.removeEventListener('abort', abortHandler);
            if ((error as DOMException).name === 'AbortError') {
                reject(error);
            } else {
                console.error("PDF processing error:", error);
                reject(new Error('Error parsing PDF file. It may be corrupted or in an unsupported format.'));
            }
        }
      };
      reader.onerror = (error) => {
        signal.removeEventListener('abort', abortHandler);
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error('Unsupported file type. Please upload a .txt or .pdf file.');
};