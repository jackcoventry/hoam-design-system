import SearchForm, {
  SearchFormResult,
  SearchFormSchemaType,
  SearchLoader,
  SearchResults,
} from '@/components/Form/SearchForm/SearchForm';
import type { ModalRootProps } from '@/components/Modal/Modal';
import { Modal } from '@/components/Modal/Modal';
import { useMockRequest } from '@/hooks/useMockRequest';
import SearchResultsData from '@/mocks/components/SearchResults';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Modal>;

function BasicModalStory(props: Readonly<ModalRootProps>) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open modal
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="My simple modal"
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

function NoTitleModalStory() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open modal
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="My simple modal"
      >
        <Modal.Header>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <p>Hello from the modal</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function CustomHeaderModalStory() {
  const [open, setOpen] = useState(false);

  const confirmDelete = () => {};

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open modal
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        variant="modal"
      >
        <Modal.Header>
          <Modal.Title>
            Delete <strong>“My Project”</strong>?
          </Modal.Title>

          <Modal.CloseButton ariaLabel="Close delete confirmation" />
        </Modal.Header>

        <Modal.Body>
          <p>This action cannot be undone.</p>
          <button
            type="button"
            onClick={confirmDelete}
          >
            Delete project
          </button>
        </Modal.Body>
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
      <button
        type="button"
        onClick={() => setOpen(true)}
      >
        Open Search
      </button>

      <Modal
        isOpen={open}
        onClose={handleClose}
        variant="modal"
      >
        <Modal.Header padded={false}>
          <SearchForm
            onSubmit={onSubmit}
            loading={loading}
          />
        </Modal.Header>

        <Modal.Body padded={false}>
          {loading && !safeError ? <SearchLoader /> : null}
          {safeError ? (
            <div
              role="alert"
              style={{ padding: '1rem' }}
            >
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

export const NoTitle: Story = {
  render: () => <NoTitleModalStory />,
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
