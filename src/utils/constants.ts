export const STATES = [
  'Pending Fix',
  'In Progress',
  'Under Review',
  'Solved',
  'False Positive',
  'Duplicate'
] as const;

export const STATE_TRANSITIONS = {
  'Pending Fix': ['In Progress', 'Under Review', 'False Positive', 'Duplicate'],
  'In Progress': ['Under Review', 'Solved', 'False Positive', 'Duplicate'],
  'Under Review': ['Solved', 'False Positive', 'Duplicate'],
  'Solved': [],
  'False Positive': [],
  'Duplicate': [],
};

export const CRITICALITY_OPTIONS = ['High', 'Medium', 'Low'];

export const CWE_OPTIONS = [
  'CWE-22: Path Traversal',
  'CWE-78: OS Command Injection',
  'CWE-79: Cross-site Scripting (XSS)',
  'CWE-89: SQL Injection',
  'CWE-200: Information Exposure',
  'CWE-287: Improper Authentication',
  'CWE-306: Missing Authentication',
  'CWE-434: Unrestricted Upload',
  'CWE-521: Weak Password Requirements',
  'CWE-601: Open Redirect',
  'CWE-611: XXE',
  'CWE-918: SSRF'
];
