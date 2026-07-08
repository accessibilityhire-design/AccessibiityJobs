'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link2,
  Undo,
  Redo,
  Heading2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  /** Set to the Label's htmlFor target so the editor gets an accessible name */
  id?: string;
  /** Explicit accessible name (fallback when no <label> is associated) */
  ariaLabel?: string;
  /** id(s) of error/help text associated with the editor */
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  className,
  minHeight = '200px',
  id,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        // The contenteditable is the real form control — give it the label
        // association and validation state (WCAG 1.3.1 / 4.1.2)
        ...(id && { id }),
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
        ...(ariaInvalid && { 'aria-invalid': 'true' }),
        role: 'textbox',
        'aria-multiline': 'true',
        class: cn(
          'prose prose-sm max-w-none focus:outline-none p-4',
          'prose-headings:font-bold prose-headings:text-gray-900',
          'prose-p:text-gray-700 prose-p:leading-relaxed',
          'prose-ul:list-disc prose-ul:pl-6',
          'prose-ol:list-decimal prose-ol:pl-6',
          'prose-li:text-gray-700',
          'prose-strong:font-semibold prose-strong:text-gray-900',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Always return a string, never undefined
      onChange(html || '');
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Ensure content is always a string
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-white', className)}>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50"
        role="toolbar"
        aria-label="Text formatting"
      >
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <Link2 className="h-4 w-4" />
        </MenuButton>

        {editor.isActive('link') && (
          <MenuButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <Link2 className="h-4 w-4 text-red-600" />
          </MenuButton>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className="min-h-[200px]"
      />
    </div>
  );
}

function MenuButton({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-2 rounded hover:bg-gray-100 transition-colors',
        isActive && 'bg-gray-200 text-blue-600'
      )}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
}

