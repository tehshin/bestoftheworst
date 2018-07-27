using System.Linq;
using AutoMapper;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Resolver;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<PaginatedList<Movie>, MovieListViewModel>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(_ => _.ToList()))
                .ForMember(dest => dest.Paging, opt => opt.MapFrom(_ => 
                    new MovieListViewModel.PagingInfo {
                        PageIndex = _.PageIndex,
                        PageSize = _.PageSize,
                        TotalItems = _.TotalItems,
                        TotalPages = _.TotalPages
                    }
                ));

            CreateMap<MovieFormViewModel, Movie>()
                .ForMember(dest => dest.Tags, opt => opt.ResolveUsing<StringTagResolver>())
                .ForMember(dest => dest.ImageId, opt => opt.MapFrom(_ => _.Image))
                .ForMember(dest => dest.Image, opt => opt.Ignore());

            CreateMap<LinkViewModel, Link>()
                .ForMember(dest => dest.LinkType, opt => opt.MapFrom(_ => _.LinkType))
                .ForMember(dest => dest.Href, opt => opt.MapFrom(_ => _.Href));

            CreateMap<GenreViewModel, Genre>();

            CreateMap<Movie, MovieDetailViewModel>()
                .ForMember(dest => dest.RelatedMovies, opt => opt.Ignore())
                .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(_ => 
                    _.ReleaseDate.HasValue ? _.ReleaseDate.Value.ToString("yyyy-MM-dd") : null));
        }
    }
}