import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState('');

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.__yianToastTimer);
    window.__yianToastTimer = window.setTimeout(() => setToast(''), 2600);
  }, []);

  const openDialog = useCallback((title, message, actionLabel = '知道了', onAction = null) => {
    setDialog({ title, message, actionLabel, onAction });
  }, []);

  const value = useMemo(() => ({ notify, openDialog }), [notify, openDialog]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {toast && <div className="app-toast" role="status">{toast}</div>}
      {dialog && (
        <div className="app-dialog-backdrop" role="presentation" onClick={() => setDialog(null)}>
          <section className="app-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h2>{dialog.title}</h2>
            {typeof dialog.message === 'string' ? <p>{dialog.message}</p> : <div className="app-dialog-content">{dialog.message}</div>}
            <button type="button" onClick={() => {
              const action = dialog.onAction;
              setDialog(null);
              action?.();
            }}>{dialog.actionLabel}</button>
          </section>
        </div>
      )}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
