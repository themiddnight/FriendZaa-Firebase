const postModalBody = document.getElementById('postModalBody')
const loadPostSpinnerHtml = `
    <div class="d-flex justify-content-center">
        <div class="spinner-border my-5" role="status" id="loadPostSpinner"></div>
    </div>`;

async function getPost(id) {
    postModalBody.innerHTML = loadPostSpinnerHtml;
    fetch(`/post/${id}?modal=true`)
        .then(res => res.json())
        .then(data => {
            const post = data.post;
            const comments = data.comments;

            let postFromHtml = '';
            if (post.from) {
                postFromHtml = `<span class="fw-bold">${post.from}</span>`
            } else {
                postFromHtml = `<span class="fw-light">[ไม่มีชื่อ]</span>`
            }

            let postHtml = `
                <div class="card shadow-sm mb-4 rounded-0">
                    <h3 class="card-header py-3">${post.title}</h3>
                    <div class="card-body">
                        <p class="card-text lead">${post.content}</p>
                        <p class="card-text">
                            ${postFromHtml} · 
                            <small class="fw-light">${post.createdAt}</small>
                        </p>
                    </div>
                </div>
                <div class="card shadow-sm rounded-0">
                    <div class="card-header">
                        <h1 class="card-text fs-5 py-1">ตอบกลับโพส</h1>
                    </div>
                    <form action="/post/${id}?modal=true" method="post">
                        <div class="card-body">
                
                            <label class="form-label" for="content">คอมเม้น: <span class="text-danger">*</span></label>
                            <textarea class="form-control mb-3" style="height: 100px;" name="content" id="content" cols="30" rows="10" placeholder="อยากบอกไร จขพ" required></textarea>
                
                            <label class="form-label" for="from">จากคุณ:</label>
                            <input class="form-control mb-3" type="text" name="from" id="from" placeholder="ชื่อ">
                
                            <div class="d-flex justify-content-end">
                            <button class="col-12 btn btn-dark" type="submit">ตอบกลับ</button>
                            </div>
                        </div>
                    </form>
                </div>`;
            if (comments.length > 0) {
                postHtml +=
                `<hr>
                <div>
                    <h4 class="card-text">${comments.length} ตอบกลับ</h4>
                    <div class="list-group list-group-flush">`;
                comments.forEach(comment => {
                    let commentFromHtml = '';
                    if (post.from) {
                        commentFromHtml = `<span class="fw-bold">${comment.from}</span>`
                    } else {
                        commentFromHtml = `<span class="fw-light">[ไม่มีชื่อ]</span>`
                    }
                    postHtml += `
                        <div class="list-group-item bg-body-secondary mt-3">
                            <p class="lead">${comment.content}</p>
                            <p>
                                ${commentFromHtml} · 
                                <small class="fw-light">${comment.createdAt}</small>
                            </p>
                        </div>`;
                });
                postHtml +=
                    `</div>
                </div>`;
            }
            postModalBody.innerHTML = postHtml;
        })
        .catch(err => console.error(err));
}
