/**
 * API client helper to interact with the backend server.
 * Includes support for request cancellation using AbortController.
 */

let activeGenerateController = null;
let activeRefineController = null;

export const api = {
  /**
   * Generates study materials from free-form text or a topic.
   * Cancels any pending generation requests.
   */
  generate: async (content) => {
    // Cancel the previous generation call if it's still running
    if (activeGenerateController) {
      activeGenerateController.abort();
    }
    
    activeGenerateController = new AbortController();
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
        signal: activeGenerateController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      return await response.json();
    } finally {
      activeGenerateController = null;
    }
  },

  /**
   * Refines existing study materials based on user prompts.
   * Cancels any pending refinement requests.
   */
  refine: async (currentMaterial, refinementInstructions) => {
    // Cancel the previous refine call if it's still running
    if (activeRefineController) {
      activeRefineController.abort();
    }

    activeRefineController = new AbortController();

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentMaterial, refinementInstructions }),
        signal: activeRefineController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      return await response.json();
    } finally {
      activeRefineController = null;
    }
  },

  /**
   * Cancels all active HTTP requests.
   */
  cancelAll: () => {
    if (activeGenerateController) {
      activeGenerateController.abort();
      activeGenerateController = null;
    }
    if (activeRefineController) {
      activeRefineController.abort();
      activeRefineController = null;
    }
  }
};
