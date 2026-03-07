import SearchForm, {
  SearchFormResult,
  SearchFormSchemaType,
  SearchLoader,
  SearchResults,
} from '@/components/Form/SearchForm/SearchForm';
import Modal from '@/components/Modal/Modal';
import { useMockRequest } from '@/hooks/useMockRequest';
import SearchResultsData from '@/mocks/components/SearchResults';
import { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Modal>;

const Template: Story = {
  render: (props) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setOpen(true)}>Open modal</button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          ariaLabel="My simple modal"
          variant={props.variant}
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
  },
};

const TemplateNoTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setOpen(true)}>Open modal</button>
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
  },
};

const TemplateForCustomHeader: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const confirmDelete = () => {};
    return (
      <div>
        <button onClick={() => setOpen(true)}>Open modal</button>
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
  },
};

const TemplateForSearchModal: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const { data, loading, error, run, reset } = useMockRequest<Array<SearchFormResult>>();

    const onSubmit: SubmitHandler<SearchFormSchemaType> = () => {
      run({
        delay: 1500,
        response: args.data,
      });
    };

    const handleClose = () => {
      setOpen(false);

      setTimeout(() => {
        reset();
      }, 500);
    };

    return (
      <div>
        <button onClick={() => setOpen(true)}>Open Search</button>
        <Modal
          isOpen={open}
          onClose={handleClose}
          variant="modal"
        >
          <Modal.Header padded={false}>
            <SearchForm
              onSubmit={onSubmit}
              data={data}
              loading={loading}
              error={error}
            />
          </Modal.Header>
          <Modal.Body padded={false}>
            {loading && !error ? <SearchLoader /> : null}
            {data && !error && !loading ? <SearchResults items={data} /> : null}
          </Modal.Body>
        </Modal>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
export const NoTitle = {
  ...TemplateNoTitle,
  args: {
    showTitle: false,
  },
};
export const Drawer = {
  ...Template,
  args: {
    variant: 'drawer',
  },
};

export const CustomHeader = {
  ...TemplateForCustomHeader,
  args: {},
};

export const CustomSearchForm = {
  ...TemplateForSearchModal,
  args: {
    data: SearchResultsData,
  },
};

export const CustomSearchFormNoResults = {
  ...TemplateForSearchModal,
  args: {
    data: [],
  },
};
