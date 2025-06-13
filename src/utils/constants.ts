export const STATES = [
  'Pending Fix',
  'In Progress',
  'Under Review',
  'Solved',
  'False Positive',
  'Duplicate'
];

export const STATE_TRANSITIONS = {
  'Pending Fix': ['In Progress', 'Under Review', 'False Positive', 'Duplicate'],
  'In Progress': ['Under Review', 'Solved', 'False Positive', 'Duplicate'],
  'Under Review': ['Solved', 'False Positive', 'Duplicate'],
  'Solved': [],
  'False Positive': [],
  'Duplicate': [],
};

export const CWE_OPTIONS = [
  'CWE-79','CWE-89','CWE-22','CWE-200','CWE-287','CWE-352','CWE-502','CWE-611','CWE-798','CWE-434'
];
export const CRITICALITY_OPTIONS = ['High', 'Medium', 'Low'];
