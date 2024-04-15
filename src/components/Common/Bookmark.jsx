import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
function Bookmark({ id, isBookmarked, onClick }) {
    const [bookmark, setBookmark] = useState();
    useEffect(() => {
        setBookmark(isBookmarked);
    }, [id]);

    const handleClick = async (question_id) => {
        let toggleBookmarkState = !bookmark;
        setBookmark(toggleBookmarkState);
        if ((await onClick(question_id, toggleBookmarkState)) === false) {
            setBookmark(!toggleBookmarkState);
        }
    };

    return (
        <button className="btn bookmark_btn  p-0" onClick={() => handleClick(id)}>
            {bookmark ? <FaBookmark className="bookmark-icon" /> : <FaRegBookmark className="bookmark-icon" />}
        </button>
    );
}

Bookmark.propTypes = {
    id: PropTypes.string.isRequired,
    isBookmarked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};
export default Bookmark;
