// Adapted from shadcn/ui toast component
import { useContext } from "react"
import { ToastActionElement, type ToastProps } from "./toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // No toast id, dismiss all
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Toast id, dismiss specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

// For testing purposes (without the full context implementation)
// In a real app this would be a proper React context implementation
const toast = {
  _state: { toasts: [] } as State,
  _dispatch: (() => {}) as React.Dispatch<Action>,
  
  _subscribe(dispatch: React.Dispatch<Action>) {
    this._dispatch = dispatch;
  },
  
  toast(props: Omit<ToasterToast, "id">) {
    const id = genId();
    const toast = { ...props, id, open: true };
    this._dispatch({ type: actionTypes.ADD_TOAST, toast });
    return id;
  },
  
  update(id: string, props: Partial<ToasterToast>) {
    this._dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } });
  },
  
  dismiss(id?: string) {
    this._dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  },
  
  remove(id?: string) {
    this._dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
  }
};

// For simplicity, we'll use a stub implementation
export function useToast() {
  return {
    toast: (props: { title: string; description?: string; variant?: "default" | "destructive" }) => {
      console.log("TOAST:", props.title, props.description);
      // In a real implementation, this would display a toast notification
      return { id: "toast-id", dismiss: () => {} };
    },
    dismiss: (id?: string) => {
      console.log("DISMISS TOAST:", id);
    },
  };
} 