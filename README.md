# Forum website 
This project is a forum website inspired by platforms like Stack Overflow and Reddit. Users must sign up with Clerk to create and interact with threads and other users. Once signed in, users can edit their own threads and lock or unlock them. Before publishing a thread, users must select between two main categories: "Thread" and "QNA."

The behavior of a thread differs between the two categories:
- QNA threads allow users to mark a comment as the chosen answer for that specific discussion.

- Thread category behaves similarly, but without the ability to mark a comment as an answer.

Certain users are designated as moderators and have full access to manage all threads. Moderators can lock or unlock threads, edit any thread, and mark or unmark comments as answers. Users can also reply to specific comments, allowing for nested discussions. The project includes a censoring functionality to manage content.

The project is still under development, with upcoming features such as thread deletion and searchable tags for filtering threads by specific tags. Additionally, enhancement of the exciting code will of course be in focus to further improve error handling, optimizing performance and refining the design.

## Built with
- Next.js
- TypeScript
- MongoDB
- Tailwind CSS
- Clerk

[![My Skills](https://skillicons.dev/icons?i=nextjs,ts,mongodb,tailwind)](https://skillicons.dev)