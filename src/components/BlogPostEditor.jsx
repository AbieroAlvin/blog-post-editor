import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { saveDraft, publishPost } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "firebase/firestore";

const BlogPostEditor = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [postPublished, setPostPublished] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);

  useEffect(() => {
    const unsubscribeDrafts = onSnapshot(
      collection(db, "drafts"),
      (snapshot) => {
        const draftsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrafts(draftsData);
      }
    );

    const unsubscribePosts = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPublishedPosts(postsData);
    });

    return () => {
      unsubscribeDrafts();
      unsubscribePosts();
    };
  }, []);

  const handleChange = (e) => {
    setMarkdownContent(e.target.value);
    setDraftSaved(false);
    setPostPublished(false);
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft(markdownContent);
      setDraftSaved(true);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handlePublishPost = async () => {
    try {
      await publishPost(markdownContent);
      setPostPublished(true);
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Write your blog post</h2>
        <textarea
          className="w-full h-96 p-2 border border-gray-300 rounded-md resize-none"
          value={markdownContent}
          onChange={handleChange}
          placeholder="Start writing in Markdown..."
        />
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleSaveDraft}
            disabled={draftSaved}
          >
            {draftSaved ? "Draft Saved" : "Save Draft"}
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePublishPost}
            disabled={postPublished}
          >
            {postPublished ? "Post Published" : "Publish Post"}
          </button>
        </div>
      </div>
      <div className="md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
      <div className="md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Drafts</h2>
        <ul>
          {drafts.map((draft) => (
            <li key={draft.id}>{draft.content}</li>
          ))}
        </ul>
        <h2 className="text-2xl font-bold mb-4 mt-8">Published Posts</h2>
        <ul>
          {publishedPosts.map((post) => (
            <li key={post.id}>{post.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogPostEditor;
