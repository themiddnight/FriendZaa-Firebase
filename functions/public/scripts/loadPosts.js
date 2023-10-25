const bottomElem = document.getElementById('bottomElem');
const postContainer = document.getElementById('postContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreSpinner = document.getElementById('loadMoreSpinner');
const endContentP = document.getElementById('endContentP');

let lastPostId = '';

async function getPosts() {
  loadMoreBtn.classList.add('d-none');
  loadMoreSpinner.classList.remove('d-none');

  fetch(`/get-posts?lastPostId=${lastPostId}`)
    .then(res => res.json())
    .then(data => {
      let postFromHtml = '';
      document.querySelectorAll('.anim').forEach(element => element.classList.remove('anim'));
      bottomElem.classList.add('anim');
      const posts = data.allPosts;
      let isLastPage = data.isLastPage;
      lastPostId = data.lastPostId;
      posts.forEach(post => {
        if (!post.title) {
          post.title = post.content.substring(0, 15) + '...';
        }
        if (post.from) {
          postFromHtml = `<span class="fw-bold">${post.from}</span>`
        } else {
          postFromHtml = `<span class="fw-light">[ไม่มีชื่อ]</span>`
        }
        let commentsCount = ''
        post.commentsCount > 0 ? commentsCount = `${post.commentsCount}  ตอบกลับ` : commentsCount = 'ยังไม่มีใครตอบ';
        let postHtml = `
          <div class="card shadow-sm mb-4 rounded-0 anim">
            <h3 class="card-header py-3">
              <a class="text-dark link-offset-1 link-underline-secondary" href="/post/${post.id}">
                ${post.title}
              </a>
            </h3>
            <div class="card-body" data-bs-toggle="modal" data-bs-target="#postModal" style="cursor: pointer;" onclick="getPost('${post.id}')">
              <p class="card-text">
                ${postFromHtml} · 
                <small class="fw-light">${post.createdAt}</small>
              </p>
              <p class="card-text">${commentsCount}</p>
            </div>
          </div>`;
        postContainer.innerHTML += postHtml;
      });
      loadMoreSpinner.classList.add('d-none');
      loadMoreBtn.classList.remove('d-none');
      if (isLastPage) {
        loadMoreBtn.classList.add('d-none');
        endContentP.classList.remove('d-none');
      }
    })
    .catch(err => console.error(err));
}

document.getElementById('loadMoreBtn').addEventListener('click', () => {
  getPosts();
});

await getPosts();
// create script tag for the new posts
const script = document.createElement('script');
script.src = '/scripts/getPost.js';
document.body.appendChild(script);