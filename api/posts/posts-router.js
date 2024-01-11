// implement your posts router here
const express = require('express');
const Poster = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
    Poster.find()
        .then(posts => {
            res.json(posts)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack,
            });
        });
});

router.get('/:id', (req, res) => {
    Poster.findById(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving posts",
            });
        });
});
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    } else {
        Poster.insert({ title, contents })
            .then(({ id }) => {
                return Poster.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack,
                })
            })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const post = await Poster.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
            })
        } else {
            await Poster.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
            stack: err.stack,
        })
    }
})
router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    } else {
        Poster.findById(req.params.id)
            .then(stuff => {
                if (!stuff) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist",
                    })
                } else {
                    return Poster.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Poster.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The posts information could not be retrieved",
                    err: err.message,
                    stack: err.stack,
                })
            })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Poster.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: " The post with the specified ID does not exist",
            })
        } else {
            const messages = await Poster.findPostComments(req.params.id)
            res.json(messages)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    }
})



module.exports = router;