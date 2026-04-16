import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/Button';
import {
  SearchForm,
  SearchFormSchemaType,
  SearchLoader,
  SearchResults,
} from '@/components/Form/SearchForm';
import { Stack } from '@/components/Layout';
import { Modal, type ModalRootProps, Variants } from '@/components/Modal';
import { useFetchSignal } from '@/hooks/useFetch';
import { getSearchResults } from '@/utils/fetchers/getSearchResults';

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
  noResults?: boolean;
};

function SearchModalStory({ noResults = false }: Readonly<SearchModalStoryProps>) {
  const [open, setOpen] = useState(false);
  const endpoint = '/';
  const fetcher = useMemo(() => getSearchResults(endpoint), [endpoint]);

  const { data, error, loading, reload } = useFetchSignal(fetcher, {
    manual: true,
  });

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async () => {
    await reload();
  };

  const safeError = error instanceof Error ? error : undefined;

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      void reload();
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
          {data && !safeError && !loading ? <SearchResults items={noResults ? [] : data} /> : null}
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
  render: () => <SearchModalStory />,
};

export const CustomSearchFormNoResults: Story = {
  render: () => <SearchModalStory noResults={true} />,
};
