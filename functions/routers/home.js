const express = require('express');
const { collection, getDocs, query, orderBy, count, where, limit, startAfter, doc, getDoc } = require('firebase/firestore');
const db = require('../utils/db.js');
const convertDate = require('../utils/convertDate.js');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/get-posts', async (req, res) => {
    try {
        const lastPostId = req.query.lastPostId; // id of the last post in the previous page
        let isLastPage = false;
        const allPosts = [];
        const pageSize = 50; // number of posts per page
        let q;
        if (lastPostId) {
            // if lastPostId is provided, start after that post
            const lastPost = await getDoc(doc(db, 'posts', lastPostId));
            q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(lastPost), limit(pageSize));
        } else {
            // if lastPostId is not provided, start from the beginning
            q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(pageSize));
        }
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
            let post = doc.data();
            // get the number of comments
            const q = query(collection(db, 'comments'), count, where('postId', '==', doc.id));
            const querySnapshot = await getDocs(q);
            post.commentsCount = querySnapshot.size;
            // convert date to a readable format
            post.createdAt = convertDate(post.createdAt);
            allPosts.push({ id: doc.id, ...post });
        }
        // if the number of posts is less than pageSize, it means that it is the last page
        if (querySnapshot.docs.length < pageSize) {
            isLastPage = true;
        }
        res.json({ allPosts, lastPostId: querySnapshot.docs[querySnapshot.docs.length - 1]?.id, isLastPage });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

module.exports = router;
