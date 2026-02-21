# Database Information

## Current Setup

### Development (Local)
- **Database**: SQLite
- **File**: `dev.db` (in project root)
- **Connection**: `file:./dev.db`
- **Why SQLite**: Fast, simple, no setup required for local development

### Production (Vercel)
- **Database**: PostgreSQL (via Vercel Postgres)
- **Connection**: Provided via `DATABASE_URL` environment variable
- **Why PostgreSQL**: Scalable, handles concurrent users efficiently, production-ready

## Database Efficiency

### Current Schema Optimizations

1. **Indexes** for fast queries:
   - `Comment.postSlug` - Fast filtering by post
   - `Comment.parentId` - Fast reply lookups
   - `PostReaction.postSlug` - Fast reaction counts
   - `PostReaction.postSlug + type` - Fast reaction type filtering
   - Unique constraints prevent duplicates

2. **Cascade Deletes**: When a comment is deleted, all replies and reactions are automatically deleted (prevents orphaned data)

3. **Efficient Queries**: 
   - Comments fetch only top-level comments, then include nested replies in one query
   - Reactions are grouped by type server-side (minimal database roundtrips)

### Scalability Considerations

**SQLite Limitations** (Local Dev):
- ✅ Fine for development and small projects
- ⚠️ Not recommended for production with many concurrent users
- ⚠️ Single-writer limitation (can cause locks with high traffic)

**PostgreSQL Advantages** (Production):
- ✅ Handles thousands of concurrent connections
- ✅ Better performance with large datasets
- ✅ ACID compliance for data integrity
- ✅ Better indexing and query optimization

### When to Migrate

If you notice:
- Slow comment loading with many comments (>1000)
- Database locks or errors during high traffic
- Need for advanced features (full-text search, complex queries)

Consider:
- Using PostgreSQL in production (already set up via Vercel Postgres)
- Adding pagination for comments (load 20 at a time)
- Implementing caching (Redis) for frequently accessed data

## Current Data Models

1. **Comment** - Stores comments and replies (self-referencing via `parentId`)
2. **CommentReaction** - Reactions on comments (like, love, etc.)
3. **PostReaction** - Reactions on blog posts
4. **PostLike** - Legacy like system (can be removed if not used)
5. **AskSubmission** - Questions submitted via "Ask" form

## Migration Path

When deploying to Vercel:
1. Create a Vercel Postgres database in your Vercel dashboard
2. Copy the `DATABASE_URL` to your environment variables
3. Run `npx prisma migrate deploy` to apply migrations
4. Your production database will use PostgreSQL automatically

The same Prisma schema works with both SQLite and PostgreSQL - Prisma handles the differences automatically!
