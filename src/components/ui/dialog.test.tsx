import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestApp } from '@/test/TestApp';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogFooter } from './dialog';

describe('Dialog', () => {
  it('renders dialog with scrolling content', () => {
    render(
      <TestApp>
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Test Dialog</DialogTitle>
            <div>
              {Array.from({ length: 50 }, (_, i) => (
                <p key={i} data-testid={`content-${i}`}>
                  This is a long content item {i} to test scrolling behavior in the dialog.
                </p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </TestApp>
    );

    // Dialog should be closed initially
    expect(screen.queryByTestId('content-0')).not.toBeInTheDocument();

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Dialog should be open and show content
    expect(screen.getByTestId('content-0')).toBeInTheDocument();
    expect(screen.getByTestId('content-49')).toBeInTheDocument();

    // Verify the dialog title is present
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('maintains close button accessibility with scrolling content', () => {
    render(
      <TestApp>
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Test Dialog</DialogTitle>
            <div>
              {Array.from({ length: 30 }, (_, i) => (
                <p key={i} data-testid={`content-${i}`}>
                  Content item {i} for testing close button visibility.
                </p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </TestApp>
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Close button should be present and accessible
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toBeVisible();
  });

  it('keeps DialogFooter fixed at bottom with scrolling content', () => {
    render(
      <TestApp>
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Test Dialog with Footer</DialogTitle>
            <div>
              {Array.from({ length: 50 }, (_, i) => (
                <p key={i} data-testid={`content-${i}`}>
                  Long content item {i} to test footer positioning with scrolling.
                </p>
              ))}
            </div>
            <DialogFooter>
              <button>Cancel</button>
              <button>Submit</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TestApp>
    );

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));

    // Both content and footer should be visible
    expect(screen.getByTestId('content-0')).toBeInTheDocument();
    expect(screen.getByTestId('content-49')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();

    // Footer buttons should be visible and clickable
    const cancelButton = screen.getByText('Cancel');
    const submitButton = screen.getByText('Submit');
    expect(cancelButton).toBeVisible();
    expect(submitButton).toBeVisible();
  });
});