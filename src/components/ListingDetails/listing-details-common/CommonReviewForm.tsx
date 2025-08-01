import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const CommonReviewForm = ({ propertyId }: { propertyId: string | number }) => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_rate_update.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            book_id: propertyId,
            total_rate: rating,
            rate_text: comment,
          }),
        }
      );
      const data = await res.json();
      if (data.Result === "true") {
        setMessage("Review submitted successfully!");
        setComment("");
        setRating(5);
      } else {
        setMessage(data.ResponseMsg || "Failed to submit review.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <h4 className="mb-20">Leave A Reply</h4>
        <p className="fs-20 lh-lg pb-15">
          <Link
            href="/login"
            className="color-dark fw-500 text-decoration-underline"
          >
            Sign in
          </Link>{" "}
          to post your comment or signup if you don&apos;t have any account.
        </p>
      </>
    );
  }

  return (
    <>
      <h4 className="mb-20">Leave A Reply</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select
            className="form-control"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            placeholder="Write your review here..."
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{
            background: "#fff",
            color: "#0072c6",
            border: "1.5px solid #0072c6",
            fontWeight: 600,
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#0072c6";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            (e.currentTarget as HTMLButtonElement).style.color = "#0072c6";
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Post Review"}
        </button>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </form>
    </>
  );
};

export default CommonReviewForm;
