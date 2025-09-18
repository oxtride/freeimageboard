import sqlite3 from 'sqlite3';

// Initialize database (will be passed from server)
let db;

export function setDatabase(databaseInstance) {
  db = databaseInstance;
}

// Helper functions with Promises for async operations
function getThreads() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        t.id,
        t.subject,
        t.created_at,
        p.id as op_id,
        p.author as op_author,
        p.comment as op_comment,
        p.image_url as op_image_url,
        p.image_filename as op_image_filename,
        p.created_at as op_created_at
      FROM threads t
      LEFT JOIN posts p ON t.id = p.thread_id AND p.id = (
        SELECT MIN(id) FROM posts WHERE thread_id = t.id
      )
      ORDER BY (
        SELECT MAX(created_at) FROM posts WHERE thread_id = t.id
      ) DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const threads = rows.map(row => ({
        id: row.id,
        subject: row.subject,
        op: {
          id: row.op_id,
          author: row.op_author || 'Anonymous',
          comment: row.op_comment,
          image: row.op_image_url ? {
            url: row.op_image_url,
            filename: row.op_image_filename
          } : null,
          timestamp: new Date(row.op_created_at).getTime()
        },
        replies: []
      }));

      // Get replies for each thread
      Promise.all(threads.map(thread => getThreadReplies(thread.id)))
        .then(repliesArrays => {
          threads.forEach((thread, index) => {
            thread.replies = repliesArrays[index];
          });
          resolve(threads);
        })
        .catch(reject);
    });
  });
}

function getThreadReplies(threadId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM posts WHERE thread_id = ? ORDER BY created_at ASC`,
      [threadId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Skip the first post (OP) and return replies
        const replies = rows.slice(1).map(row => ({
          id: row.id,
          author: row.author || 'Anonymous',
          comment: row.comment,
          image: row.image_url ? {
            url: row.image_url,
            filename: row.image_filename
          } : null,
          timestamp: new Date(row.created_at).getTime()
        }));

        resolve(replies);
      }
    );
  });
}

function createThread(subject, comment, author, imageData) {
  return new Promise((resolve, reject) => {
    // Insert thread
    db.run(`INSERT INTO threads (subject) VALUES (?)`, [subject], function(err) {
      if (err) {
        reject(err);
        return;
      }

      const threadId = this.lastID;

      // Insert OP post
      db.run(
        `INSERT INTO posts (thread_id, author, comment, image_url, image_filename) VALUES (?, ?, ?, ?, ?)`,
        [threadId, author || 'Anonymous', comment, imageData?.url || null, imageData?.filename || null],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            id: threadId,
            subject,
            op: {
              id: this.lastID,
              author: author || 'Anonymous',
              comment,
              image: imageData,
              timestamp: Date.now()
            },
            replies: []
          });
        }
      );
    });
  });
}

function createReply(threadId, comment, author, imageData) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO posts (thread_id, author, comment, image_url, image_filename) VALUES (?, ?, ?, ?, ?)`,
      [threadId, author || 'Anonymous', comment, imageData?.url || null, imageData?.filename || null],
      function(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          id: this.lastID,
          author: author || 'Anonymous',
          comment,
          image: imageData,
          timestamp: Date.now()
        });
      }
    );
  });
}

export { getThreads, createThread, createReply };