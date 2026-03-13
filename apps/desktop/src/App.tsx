import { Button, Card, CardContent, CardHeader, CardTitle, UICoreProvider } from '@melv1c/ui-core';
import { CardHealth } from '@repo/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import {
  useAppVersion,
  useDeleteFile,
  useOpenExternal,
  usePing,
  usePlatform,
  useReadFile,
  useSelectFile,
  useSelectSaveFile,
  useShowMessageBox,
  useWriteFile,
} from './hooks';
import { useAPIHealth } from './hooks/use-api-health';
import './index.css';

// Create a client outside the component to avoid recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

function AppContent() {
  const [count, setCount] = useState(0);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');

  // Queries for data
  const { data: pingResponse, isLoading: isPinging } = usePing();
  const { data: appVersion } = useAppVersion();
  const { data: platform } = usePlatform();

  // File operations
  const { data: fileContent, isLoading: isLoadingFile } = useReadFile(currentFilePath);
  const selectFile = useSelectFile();
  const selectSaveFile = useSelectSaveFile();
  const writeFile = useWriteFile();
  const deleteFile = useDeleteFile();

  // Mutations for actions
  const openExternal = useOpenExternal();
  const showMessage = useShowMessageBox();

  const handleOpenDocs = () => {
    openExternal.mutate('https://www.electronjs.org/docs');
  };

  const handleShowMessage = () => {
    showMessage.mutate({
      type: 'info',
      title: 'Hello!',
      message: `Current count is ${count}`,
      buttons: ['Nice!', 'Cancel'],
    });
  };

  // File handlers
  const handleOpenFile = async () => {
    selectFile.mutate(
      { title: 'Open File', filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'json'] }] },
      {
        onSuccess: filePath => {
          if (filePath) {
            setCurrentFilePath(filePath);
            setEditorContent(''); // Will be populated by useReadFile
          }
        },
      },
    );
  };

  const handleSaveFile = async () => {
    if (currentFilePath) {
      writeFile.mutate(
        { filePath: currentFilePath, content: editorContent },
        {
          onSuccess: () => {
            showMessage.mutate({
              type: 'info',
              title: 'Saved',
              message: 'File saved successfully!',
            });
          },
        },
      );
    } else {
      handleSaveAsFile();
    }
  };

  const handleSaveAsFile = async () => {
    selectSaveFile.mutate(
      { title: 'Save As', filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'json'] }] },
      {
        onSuccess: filePath => {
          if (filePath) {
            setCurrentFilePath(filePath);
            writeFile.mutate({ filePath, content: editorContent });
          }
        },
      },
    );
  };

  const handleDeleteFile = async () => {
    if (currentFilePath) {
      showMessage.mutate(
        {
          type: 'warning',
          title: 'Delete File',
          message: `Delete ${currentFilePath}?`,
          buttons: ['Delete', 'Cancel'],
        },
        {
          onSuccess: result => {
            if (result.response === 0) {
              deleteFile.mutate(currentFilePath, {
                onSuccess: () => {
                  setCurrentFilePath(null);
                  setEditorContent('');
                },
              });
            }
          },
        },
      );
    }
  };

  const handleNewFile = () => {
    setCurrentFilePath(null);
    setEditorContent('');
  };

  // Sync file content when loaded
  if (fileContent && fileContent !== editorContent && !writeFile.isPending) {
    setEditorContent(fileContent);
  }

  const { isPending, isError, refetch } = useAPIHealth();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Electron Desktop App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">App Version: {appVersion}</p>
          <p className="mb-2">
            Platform: {platform?.platform} ({platform?.arch}) - Node.js v{platform?.nodeVersion}
          </p>
          <p className="mb-4">Ping Response: {isPinging ? 'Loading...' : pingResponse}</p>
        </CardContent>
      </Card>
      <CardHealth
        className="w-full max-w-md"
        isPending={isPending}
        isError={isError}
        refetch={refetch}
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>📁 File Manager</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="text-sm text-muted-foreground truncate">
            {currentFilePath ? `📄 ${currentFilePath}` : 'No file open'}
          </div>
          <textarea
            className="w-full h-32 p-2 border rounded-md font-mono text-sm resize-none bg-background"
            placeholder={isLoadingFile ? 'Loading...' : 'Type here or open a file...'}
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            disabled={isLoadingFile}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleNewFile}>
              New
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenFile}
              disabled={selectFile.isPending}
            >
              Open
            </Button>
            <Button size="sm" onClick={handleSaveFile} disabled={writeFile.isPending}>
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveAsFile}
              disabled={selectSaveFile.isPending}
            >
              Save As
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteFile}
              disabled={!currentFilePath || deleteFile.isPending}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Counter: {count}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
            <Button onClick={() => setCount(count - 1)}>Decrement</Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleOpenDocs}>Open Electron Docs</Button>
            <Button onClick={handleShowMessage}>Show Message Box</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UICoreProvider>
        <AppContent />
      </UICoreProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
