import gets from './get'
import posts from './post'
import puts from './put'
import patches from './patch'
import deletes from './delete'

export default {
  gets,
  posts,
  puts,
  patches,
  deletes,
  all: [gets, posts, puts, patches, deletes],
}
