import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FiltersBar from '../../../components/filterBar/FiltersBar';
import { VulnerabilityProvider } from '../../../context/VulnerabilityContext';
import { STATES, CRITICALITY_OPTIONS } from '../../../utils/constants';

const mockDispatch = vi.fn();

const mockUseVulnerabilities = vi.fn().mockReturnValue({
  filters: {
    search: '',
    status: '',
    criticality: '',
  },
  dispatch: mockDispatch,
});

vi.mock('../../../context/VulnerabilityContext', () => ({
  useVulnerabilities: () => mockUseVulnerabilities(),
  VulnerabilityProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('FiltersBar', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('renders all filter inputs', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    expect(screen.getByPlaceholderText('Search by title, description, or CWE...')).toBeInTheDocument();

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    expect(statusSelect).toBeInTheDocument();

    const criticalitySelect = screen.getByRole('combobox', { name: /criticality/i });
    expect(criticalitySelect).toBeInTheDocument();

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });
  it('handles search input changes', async () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search by title, description, or CWE...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FILTER',
      payload: { key: 'search', value: 'test search' },
    });
  });

  it('handles status filter changes', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.change(statusSelect, { target: { value: 'Pending Fix' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FILTER',
      payload: { key: 'status', value: 'Pending Fix' },
    });
  });

  it('handles criticality filter changes', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );    const criticalitySelect = screen.getByRole('combobox', { name: /criticality/i });
    fireEvent.change(criticalitySelect, { target: { value: 'High' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FILTER',
      payload: { key: 'criticality', value: 'High' },
    });
  });

  it('shows and handles clear filters button', () => {

    mockUseVulnerabilities.mockImplementation(() => ({
      filters: {
        search: 'test',
        status: 'open',
        criticality: 'high',
      },
      dispatch: mockDispatch,
    }));

    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const clearButton = screen.getByText('Clear Filters');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLEAR_FILTERS',
    });
  });

  it('renders all status options', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    const options = Array.from(statusSelect.getElementsByTagName('option'));
    
    expect(options).toHaveLength(Object.values(STATES).length + 1);
    expect(options[0]).toHaveTextContent('All Statuses');
    Object.values(STATES).forEach(status => {
      expect(screen.getByRole('option', { name: status })).toBeInTheDocument();
    });
  });

  it('renders all criticality options', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const criticalitySelect = screen.getByRole('combobox', { name: /criticality/i });
    const options = Array.from(criticalitySelect.getElementsByTagName('option'));
    
    expect(options).toHaveLength(CRITICALITY_OPTIONS.length + 1);
    expect(options[0]).toHaveTextContent('All Criticality');
    CRITICALITY_OPTIONS.forEach(criticality => {
      expect(screen.getByRole('option', { name: criticality })).toBeInTheDocument();
    });
  });
});
