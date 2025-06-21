
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommonModal from '../Modal';

describe('CommonModal Component', () => {
  const defaultProps = {
    show: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    title: 'Test Modal',
    body: <p>Modal content here</p>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title and body', () => {
    render(<CommonModal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content here')).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', () => {
    render(<CommonModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Close'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Save Changes button is clicked', () => {
    render(<CommonModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Save Changes'));
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it('renders custom footer when provided', () => {
    render(
      <CommonModal
        {...defaultProps}
        footer={<div>Custom Footer</div>}
      />
    );
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('does not render modal when show is false', () => {
    const { queryByRole } = render(<CommonModal {...defaultProps} show={false} />);
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });
});
