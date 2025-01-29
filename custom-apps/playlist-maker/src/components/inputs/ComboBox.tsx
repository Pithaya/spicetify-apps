import { useCombobox } from 'downshift';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

type Item = {
    id: string;
    author: string;
    title: string;
};

const books: Item[] = [
    { id: 'book-1', author: 'Harper Lee', title: 'To Kill a Mockingbird' },
    { id: 'book-2', author: 'Lev Tolstoy', title: 'War and Peace' },
    { id: 'book-3', author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
    { id: 'book-4', author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
    { id: 'book-5', author: 'George Orwell', title: '1984' },
    { id: 'book-6', author: 'Jane Austen', title: 'Pride and Prejudice' },
    { id: 'book-7', author: 'Marcus Aurelius', title: 'Meditations' },
    {
        id: 'book-8',
        author: 'Fyodor Dostoevsky',
        title: 'The Brothers Karamazov',
    },
    { id: 'book-9', author: 'Lev Tolstoy', title: 'Anna Karenina' },
    {
        id: 'book-10',
        author: 'Fyodor Dostoevsky',
        title: 'Crime and Punishment',
    },
];

function getBooksFilter(inputValue: string): (book: Item) => boolean {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function booksFilter(book: Item) {
        return (
            !inputValue ||
            book.title.toLowerCase().includes(lowerCasedInputValue) ||
            book.author.toLowerCase().includes(lowerCasedInputValue)
        );
    };
}

export function Combobox(): JSX.Element {
    const [items, setItems] = React.useState(books);
    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
    } = useCombobox({
        onInputValueChange({ inputValue }) {
            setItems(books.filter(getBooksFilter(inputValue)));
        },
        items,
        itemToString(item) {
            return item ? item.title : '';
        },
    });

    return (
        <div className="relative">
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="combobox-search"
                    className="w-fit"
                    {...getLabelProps()}
                >
                    Choose your favorite book:
                </label>
                <div className="flex gap-0.5 bg-spice-tab-active rounded-sm !pe-1">
                    <input
                        placeholder="Best book ever"
                        className="w-full p-1.5"
                        id="combobox-search"
                        {...getInputProps()}
                    />
                    <button
                        aria-label="toggle menu"
                        className="px-2"
                        type="button"
                        {...getToggleButtonProps()}
                    >
                        {isOpen ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                </div>
            </div>
            <ul
                className={`absolute w-full mt-1 max-h-80 overflow-scroll p-0 z-10 bg-spice-highlight-elevated rounded-sm ${
                    !(isOpen && items.length) && 'hidden'
                }`}
                {...getMenuProps()}
            >
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={Spicetify.classnames(
                                highlightedIndex === index
                                    ? 'bg-spice-highlight-elevated-hover'
                                    : '',
                                selectedItem === item ? 'font-bold' : '',
                                'py-2 px-3 shadow-sm flex flex-col',
                            )}
                            key={item.id}
                            {...getItemProps({ item, index })}
                        >
                            <span>{item.title}</span>
                            <span className="text-sm">{item.author}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
