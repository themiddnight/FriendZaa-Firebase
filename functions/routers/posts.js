const express = require('express');
const { collection, doc, addDoc, getDoc, getDocs, query, where, orderBy } = require('firebase/firestore');
const db = require('../utils/db.js');
const convertDate = require('../utils/convertDate.js');

const router = express.Router();

// create new post
router.post('/new', async (req, res) => {
    const createdAt = new Date();
    let { title, content, from } = req.body;
    try {
        await addDoc(collection(db, 'posts'), {
            title: title,
            content: content,
            from: from,
            createdAt: createdAt
        });
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

// get post by id
router.get('/:id', async (req, res) => {
    const modal = req.query.modal || false;
    const { id } = req.params;
    const comments = [];
    try {
        const postSnap = await getDoc(doc(db, 'posts', id));
        const post = postSnap.data();
        post.createdAt = convertDate(post.createdAt);

        const q = query(collection(db, 'comments'), where('postId', '==', id), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            let comment = doc.data();
            comment.createdAt = convertDate(comment.createdAt);
            comments.push({ id: doc.id, ...comment });
        });
        let customTitle = `${post.title} | FeelFriends`;

        if (modal) {
            res.json({ customTitle, id, post, comments });
        } else {
            res.render('postId', { customTitle, id, post, comments });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

// add comment to the post
router.post('/:id', async (req, res) => {
    const modal = req.query.modal || false;
    const createdAt = new Date();
    const { id } = req.params;
    let { content, from } = req.body;
    try {
        await addDoc(collection(db, 'comments'), {
            postId: id,
            content: content,
            from: from,
            createdAt: createdAt
        });
        if (modal) {
            res.redirect(`/post/${id}`);
        } else {
            res.redirect(`/post/${id}`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

module.exports = router;