var md = window.markdownit()

function addPostToList(file) {
  var rawFile = new XMLHttpRequest()
  rawFile.open('GET', file, false)
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        var allText = rawFile.responseText

        if ('content' in document.createElement('template')) {
          var template = document.querySelector('#post-card')
          var clone = template.content.cloneNode(true)

          var contentElement = clone.querySelector('#post-md')
          contentElement.innerHTML = md.render(allText)

          document.querySelector('#post-list').appendChild(clone)
        } else {
          // Find another way to add the rows to the table because
          // the HTML template element is not supported.
        }
      }
    }
  }
  rawFile.send(null)
}

function handler () {
  if (this.status === 200 && this.responseText != null) {
    var posts = JSON.parse(this.responseText)
    posts.forEach(post => {
      addPostToList(post.download_url)
    })
  } else {
    console.log('Error', this.status, this.responseText)
  }
}

var client = new XMLHttpRequest()
client.onload = handler
client.open('GET', 'https://api.github.com/repos/vixandrade/vixandrade.github.io/contents/posts')
client.send()
