// Common Types
export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[] | null;
  weight: number;
  metadata?: TestMetadata;
}

export interface TestMetadata {
  functionName: string;
  calls: unknown[][];
  description?: string;
  required_file?: string;
}

export interface TestTemplate {
  name: string;
  displayName: string;
  description: string;
  parameters: TestParameter[];
  required_file?: string;
}

export interface TestParameter {
  name: string;
  type: 'string' | 'integer' | 'number' | 'boolean' | 'list of strings' | 'dictionary';
  description?: string;
  defaultValue?: unknown;
  required?: boolean;
}

export interface TestLibrary {
  name: string;
  tests: TestTemplate[];
}

// Feedback Types
export interface FeedbackConfig {
  general?: GeneralConfig;
  ai?: AIConfig;
  default?: DefaultConfig;
  online_resources?: OnlineResource[];
}

export interface GeneralConfig {
  report_title?: string;
  show_passed_tests?: boolean;
  show_test_details?: boolean;
  add_report_summary?: boolean;
}

export interface AIConfig {
  feedback_tone?: string;
  feedback_persona?: string;
  assignment_context?: string;
  extra_orientations?: string;
  solution_type?: 'hint' | 'yes' | 'no';
  submission_files_to_read?: string[];
}

export interface DefaultConfig {
  category_headers?: {
    base: string;
    bonus: string;
    penalty: string;
  };
}

export interface OnlineResource {
  title: string;
  url: string;
  tags: string[];
}

// Setup Types
export interface SetupConfig {
  file_checks?: string[];
  sandbox?: SandboxConfig;
}

export interface SandboxConfig {
  runtime_image: string;
  container_port: string;
  start_command: string;
  commands: Record<string, string>;
}

// Hook Types
export interface UseArrayStateReturn<T> {
  items: T[];
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  set: (items: T[]) => void;
}

export interface UseFormInputReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  clear: () => void;
  set: (value: string) => void;
}

export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
}

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface UseSaveStateReturn {
  isSaved: boolean;
  showSuccess: boolean;
  showAnimation: boolean;
  triggerSave: () => void;
  cancelSave: () => void;
}

export interface UseFetchTemplateReturn {
  data: TestLibrary | null;
  loading: boolean;
  error: string | null;
}

// Component Props
export interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export interface SaveButtonProps {
  isSaved: boolean;
  showAnimation: boolean;
  showSuccessToast: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export interface LoadingStateProps {
  templateName?: string;
}

export interface ErrorStateProps {
  error: string;
}
