# QuickNotes Data Model

## 1. Overview

QuickNotes will use a relational SQL database, such as PostgreSQL.

Users, notes and tags have clear relationships, and the application
needs foreign keys, transactions, uniqueness constraints and JOIN
queries. SQL provides these capabilities and helps enforce data
integrity. PostgreSQL also supports indexing, replication and
reliable transactions.

A NoSQL database could be useful for flexible document data or
specific high-throughput access patterns, but it is not necessary
for the initial QuickNotes design. The relational model is a
better starting point for this application's requirements.

We will use a **relational SQL database**, such as PostgreSQL, because the data has clear relationships and needs reliable ownership rules.

## 2. Database Entities

### Users

Stores account information for each registered user.

| Column | Data type | Key / rules |
|---|---|---|
| id | BIGINT | Primary key, auto-generated |
| email | VARCHAR(255) | Required, unique |
| password_hash | VARCHAR(255) | Required; never store plain-text passwords |
| created_at | TIMESTAMP | Required |
| updated_at | TIMESTAMP | Required |

### Notes

Stores notes created by users.

| Column | Data type | Key / rules |
|---|---|---|
| id | BIGINT | Primary key, auto-generated |
| user_id | BIGINT | Foreign key referencing users.id |
| title | VARCHAR(100) | Required |
| body | TEXT | Optional |
| created_at | TIMESTAMP | Required |
| updated_at | TIMESTAMP | Required |

### Tags

Stores reusable labels for organizing notes.

| Column | Data type | Key / rules |
|---|---|---|
| id | BIGINT | Primary key, auto-generated |
| user_id | BIGINT | Foreign key referencing users.id |
| name | VARCHAR(50) | Required |
| created_at | TIMESTAMP | Required |

A tag name should be unique for each user.

### Note_Tags

Connects notes to tags. This table allows one note to have multiple tags and one tag to be used on multiple notes.

| Column | Data type | Key / rules |
|---|---|---|
| note_id | BIGINT | Primary key component; foreign key referencing notes.id |
| tag_id | BIGINT | Primary key component; foreign key referencing tags.id |

The combination of `note_id` and `tag_id` forms a composite primary key.

## 3. Entity Relationships

- **Users to Notes:** One user can have many notes. Each note belongs to one user.
- **Users to Tags:** One user can create many tags. Each tag belongs to one user.
- **Notes to Tags:** Many-to-many. The `note_tags` table connects notes and tags.

A note and its tags must belong to the same user. The application
must validate ownership before creating a note_tags association.

## 4. SQL Table Definitions

The following SQL shows how the tables could be created in PostgreSQL.

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notes_title_not_blank
        CHECK (length(trim(title)) > 0)
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT unique_tag_per_user UNIQUE (user_id, name),
    CONSTRAINT tags_name_not_blank
        CHECK (length(trim(name)) > 0)
);

CREATE TABLE note_tags (
    note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```

## 5. Example SQL Queries

### Query 1: Get all notes belonging to a user

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;
```

This returns the user's notes, with the most recently updated notes first.

### Query 2: Get one note belonging to a user

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE id = 101 AND user_id = 1;
```

Checking both the note ID and user ID helps prevent users from accessing another user's note.

### Query 3: Get notes and their tags using a JOIN

```sql
SELECT n.id, n.title, t.name AS tag_name
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON nt.tag_id = t.id
WHERE n.user_id = 1
ORDER BY n.id;
```

This combines the notes, linking table, and tags to show which tags belong to each note.

## 6. Indexes

An index helps the database find matching records without scanning the entire table.

```sql
CREATE INDEX idx_notes_user_updated
ON notes (user_id, updated_at DESC);

CREATE INDEX idx_note_tags_tag
ON note_tags (tag_id);
```

- `idx_notes_user_updated` helps retrieve a user's notes ordered by their last update.
- `idx_note_tags_tag` helps find notes associated with a particular tag.

The primary keys and unique constraints also create indexes in PostgreSQL.

## 7. SQL vs. NoSQL

For QuickNotes, I would choose a **relational SQL database such as PostgreSQL**.

Reasons:

1. Users, notes, and tags have clear relationships.
2. Foreign keys help preserve data integrity.
3. Transactions can make related changes reliable.
4. SQL JOINs make it straightforward to retrieve notes with their tags.
5. Indexes can improve performance as the number of users and notes grows.

A NoSQL database could also work, especially if the data structure were highly flexible or the application had different scaling requirements. However, SQL is a suitable starting choice for this design.
