using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class MovieService : BaseService, IMovieService
    {
        private readonly ITagService _tagService;
        private readonly IGenreService _genreService;

        public MovieService(
            IDbSession session, 
            ITagService tagService, 
            IGenreService genreService
        ) : base(session) 
        {
            _tagService = tagService;
            _genreService = genreService;
        }

        private async Task CreateGenresAsync(Movie movie)
        {
            foreach (var genre in movie.Genres)
            {
                var existingGenre = await _genreService.GetByNameAsync(genre.Name);
                if (existingGenre == null)
                {
                    existingGenre = await _genreService.CreateAsync(genre);
                }

                genre.Id = existingGenre.Id;

                await CreateMovieGenreAsync(new MovieGenre
                {
                    MovieId = movie.Id,
                    GenreId = genre.Id
                });
            }
        }

        private async Task CreateTagsAsync(Movie movie)
        {
            foreach (var tag in movie.Tags)
            {
                var existingTag = await _tagService.GetByNameAsync(tag.Name);
                if (existingTag == null)
                {
                    existingTag = await _tagService.CreateAsync(tag);
                }

                tag.Id = existingTag.Id;

                await CreateMovieTagAsync(new MovieTag
                {
                    MovieId = movie.Id,
                    TagId = tag.Id
                });
            }
        }

        private async Task CreateOrUpdateLinksAsync(Movie movie)
        {
            foreach (var link in movie.Links)
            {
                link.MovieId = movie.Id;
                
                if (link.Id > 0)
                {
                    await UpdateLinkAsync(link);
                }
                else
                {
                    link.Id = await CreateLinkAsync(link);
                }
            }
        }

        private async Task CreateLinksAsync(Movie movie)
        {
            foreach (var link in movie.Links)
            {
                link.MovieId = movie.Id;
                link.Id = await CreateLinkAsync(link);
            }
        }

        private async Task<long> CreateLinkAsync(Link linkToCreate)
        {
            string sql = @"insert into [Links] ([MovieId], [Name], [LinkType], [Href]) values (@MovieId, @Name, @LinkType, @Href);
                           select scope_identity();";

            return await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, linkToCreate);
        }

        private async Task UpdateLinkAsync(Link linkToUpdate)
        {
            string sql = @"UPDATE [dbo].[Links]
                           SET [MovieId] = @MovieId
                              ,[LinkType] = @LinkType
                              ,[Href] = @Href
                              ,[Name] = @Name
                           WHERE [Id] = @Id";
            
            await Session.Connection.ExecuteAsync(sql, linkToUpdate);
        }

        private async Task CreateMovieGenreAsync(MovieGenre movieGenreToCreate)
        {
            var sql = @"INSERT INTO [dbo].[MovieGenre] ([MovieId], [GenreId]) VALUES (@MovieId, @GenreId)";
            await Session.Connection.ExecuteAsync(sql, movieGenreToCreate);
        }

        private async Task CreateMovieTagAsync(MovieTag movieTagToCreate)
        {
            var sql = @"INSERT INTO [MovieTag] ([MovieId], [TagId]) VALUES(@MovieId, @TagId)";
            await Session.Connection.ExecuteAsync(sql, movieTagToCreate);
        }

        private void DeleteMovieTags(long movieId) 
        {
            string sql = "delete from [MovieTag] where [MovieId] = @movieId";
            Session.Connection.Execute(sql, new { movieId });
        }

        public async Task<IEnumerable<Movie>> ListAllAsync()
        {
            var sql = @"select [Id], [Title] from [Movies] order by [Title]";

            return await Session.Connection.QueryAsync<Movie>(sql);
        }

        public async Task<IEnumerable<Movie>> ListInSameEpisodeAsync(long movieId)
        {
            var sql = @"select 
                            [Id], [Title] 
                        from [Movies] 
                        where [EpisodeId] = (select [EpisodeId] from [Movies] where [Id] = @movieId)
                        and   [Id] != @movieId
                        order by [Title]";

            return await Session.Connection.QueryAsync<Movie>(sql, new { movieId });
        }

        public async Task<IEnumerable<Movie>> ListByEpisodeAsync(long episodeId)
        {
            var sql = @"select [Id], [Title] from [Movies] where [EpisodeId] = @episodeId order by [Title]";

            return await Session.Connection.QueryAsync<Movie>(sql, new { episodeId });
        }

        public async Task<PaginatedList<Movie>> ListAsync(int pageIndex, int pageSize)
        {
            var sql = @"select 
                            m.[Id],
                            m.[Title], 
                            m.[Synopsis],
                            i.[Id],
                            i.[FileName],
                            i.[Path]
                        from [Movies] m
                        left join [Images] i on m.[ImageId] = i.[Id]
                        order by m.[Title]
                        offset @pageSize * (@pageIndex - 1) rows
                        fetch next @pageSize rows only;
                        
                        select count(id) from [Movies];";

            var results = await Session.Connection.QueryMultipleAsync(sql, new { pageIndex, pageSize });

            var movies = results.Read<Movie, Image, Movie>((m, i) => {  
                m.Image = i;
                return m;
            }).ToList();

            var totalCount = results.Read<int>().FirstOrDefault();

            return new PaginatedList<Movie>(movies, totalCount, pageIndex, pageSize);
        }

        public async Task<PaginatedList<Movie>> SearchAsync(string query, int pageIndex, int pageSize)
        {
            var sql = @"select 
                            m.[Id],
                            m.[Title], 
                            m.[Synopsis],
                            i.[Id],
                            i.[FileName],
                            i.[Path]
                        from [Movies] m
                        left join [Images] i on m.[ImageId] = i.[Id]
                        where CONTAINS(m.[Title], @query)
                        or    CONTAINS(m.[Synopsis], @query)
                        order by m.[Title]
                        offset @pageSize * (@pageIndex - 1) rows
                        fetch next @pageSize rows only;
                        
                        select count([Id]) from [Movies]
                        where CONTAINS([Title], @query)
                        or    CONTAINS([Synopsis], @query);";

            var terms = query.Trim().ToLowerInvariant()
                .Split(separator: ' ', options: StringSplitOptions.RemoveEmptyEntries);

            query = string.Join(" OR ", terms);

            var results = await Session.Connection.QueryMultipleAsync(sql, new { query, pageIndex, pageSize });

            var movies = results.Read<Movie, Image, Movie>((m, i) => {  
                m.Image = i;
                return m;
            }).ToList();

            var totalCount = results.Read<int>().FirstOrDefault();

            return new PaginatedList<Movie>(movies, totalCount, pageIndex, pageSize);
        }

        public async Task<Movie> GetByIdAsync(long id)
        {
            var sql = @"select 
                            m.[Id],
                            m.[Title], 
                            m.[Synopsis],
                            m.[Overview],
                            m.[Runtime],
                            m.[ReleaseDate],
                            e.[Id],
                            e.[Title],
                            e.[VideoId],
                            i.[Id],
                            i.[FileName],
                            i.[Path]
                        from [Movies] m
                        join [Episodes] e on m.[EpisodeId] = e.[Id]
                        left join [Images] i on m.[ImageId] = i.[Id]
                        where m.[Id] = @id;

                        select distinct t.[Id], t.[Name] from MovieTag mt 
                        join [Tags] t on mt.[TagId] = t.[Id]
                        where mt.[MovieId] = @id;
                        
                        select [Id], [MovieId], [LinkType], [Name], [Href] from [Links]
                        where [MovieId] = @id;
                        
                        select distinct g.[Id], g.[Name] from [MovieGenre] mg 
                        join [Genre] g on mg.[GenreId] = g.[Id]
                        where mg.[MovieId] = @id;";

            var results = await Session.Connection.QueryMultipleAsync(sql, new { id });

            var movie = results.Read<Movie, Episode, Image, Movie>((m, e, i) => {
                m.Image = i;
                m.Episode = e;
                return m;
            }).FirstOrDefault();

            var movieTags = results.Read<Tag>().ToList();
            var movieLinks = results.Read<Link>().ToList();
            var movieGenres = results.Read<Genre>().ToList();

            if (movie != null) {
                movie.Tags = movieTags;
                movie.Links = movieLinks;
                movie.Genres = movieGenres;
            }
            
            return movie;
        }

        public async Task<Movie> CreateAsync(Movie movieToCreate)
        {
            var sql = @"INSERT INTO [Movies]
                            ([Title]
                            ,[Overview]
                            ,[ReleaseDate]
                            ,[Runtime]
                            ,[Synopsis]
                            ,[ImageId]
                            ,[EpisodeId])
                        VALUES
                            (@Title
                             ,@Overview
                             ,@ReleaseDate
                             ,@Runtime
                             ,@Synopsis
                             ,@ImageId
                             ,@EpisodeId);
                        select scope_identity();";

            movieToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, movieToCreate);

            await CreateTagsAsync(movieToCreate);
            await CreateLinksAsync(movieToCreate);
            await CreateGenresAsync(movieToCreate);
            
            return movieToCreate;
        }

        public async Task<long> UpdateAsync(Movie movieToUpdate)
        {
            var sql = @"update [Movies] 
                        set [Title] = @Title
                            ,[Synopsis] = @Synopsis
                            ,[ImageId] = @ImageId
                            ,[EpisodeId] = @EpisodeId
                        where [Id] = @Id";

            DeleteMovieTags(movieToUpdate.Id);
            await CreateTagsAsync(movieToUpdate);
            await CreateOrUpdateLinksAsync(movieToUpdate);
            
            await Session.Connection.ExecuteAsync(sql, movieToUpdate);
            return movieToUpdate.Id;
        }

        public async Task<long> DeleteAsync(long id)
        {
            var sql = @"delete from [Movie] where [Id] = @id";

            await Session.Connection.ExecuteAsync(sql, new { id });

            return id;
        }
    }
}