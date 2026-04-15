import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/Button';
import {
  SearchForm,
  type SearchFormResult,
  type SearchFormSchemaType,
  SearchLoader,
  SearchResults,
} from '@/components/Form/SearchForm';
import { Modal, type ModalRootProps, Variants } from '@/components/Modal';
import { useMockRequest } from '@/hooks/useMockRequest';
import SearchResultsData from '@/mocks/components/SearchResults';

import { Stack } from '../Layout';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    variant: 'modal',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: Variants,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

function BasicModalStory(props: Readonly<ModalRootProps>) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open modal
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        aria-label="My simple modal"
        {...(props.variant === undefined ? {} : { variant: props.variant })}
      >
        <Modal.Header>
          <Modal.Title>My simple modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <p>Hello from the modal</p>
        </Modal.Body>

        <Modal.Footer>
          <p>Footer!</p>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function CustomHeaderModalStory() {
  const [open, setOpen] = useState(false);

  const confirmDelete = () => {};

  return (
    <div>
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open modal
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        variant="modal"
      >
        <Modal.Header>
          <Modal.Title>
            Delete <strong>“My Project”</strong>?
          </Modal.Title>

          <Modal.CloseButton aria-label="Close delete confirmation" />
        </Modal.Header>

        <Modal.Body>
          <Stack>
            <p>This action cannot be undone.</p>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            onClick={confirmDelete}
            style={{
              marginLeft: 'auto',
            }}
          >
            Delete project
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

type SearchModalStoryProps = {
  data: SearchFormResult[];
};

function SearchModalStory({ data }: Readonly<SearchModalStoryProps>) {
  const [open, setOpen] = useState(false);
  const { data: results, loading, error, run, reset } = useMockRequest<Array<SearchFormResult>>();

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async () => {
    await run({
      delay: 1500,
      response: data,
    });
  };

  const safeError = error instanceof Error ? error : undefined;

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      reset();
    }, 500);
  };

  return (
    <div>
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open Search
      </Button>

      <Modal
        isOpen={open}
        onClose={handleClose}
        variant="modal"
      >
        <Modal.Header padded={false}>
          <SearchForm
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
          />
        </Modal.Header>

        <Modal.Body padded={false}>
          {loading && !safeError ? <SearchLoader /> : null}
          {safeError ? (
            <div role="alert">
              <p>{safeError.message}</p>
            </div>
          ) : null}
          {results && !safeError && !loading ? <SearchResults items={results} /> : null}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <BasicModalStory {...args} />,
};

export const Drawer: Story = {
  render: (args) => <BasicModalStory {...args} />,
  args: {
    variant: 'drawer',
  },
};

export const CustomHeader: Story = {
  render: () => <CustomHeaderModalStory />,
};

export const CustomSearchForm: Story = {
  render: () => <SearchModalStory data={SearchResultsData} />,
};

export const CustomSearchFormNoResults: Story = {
  render: () => <SearchModalStory data={[]} />,
};
