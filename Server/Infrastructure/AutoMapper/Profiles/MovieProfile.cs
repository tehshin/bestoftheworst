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

            CreateMap<CreateMovieViewModel, Movie>()
                .ForMember(dest => dest.Tags, opt => opt.ResolveUsing<StringTagResolver>())
                .ForMember(dest => dest.ImageId, opt => opt.MapFrom(_ => _.Image))
                .ForMember(dest => dest.Image, opt => opt.Ignore());

            CreateMap<CreateMovieViewModel.LinkInfo, Link>()
                .ForMember(dest => dest.LinkType, opt => opt.MapFrom(_ => _.LinkType))
                .ForMember(dest => dest.Href, opt => opt.MapFrom(_ => _.Href));

            CreateMap<UpdateMovieViewModel, Movie>();

            CreateMap<Movie, MovieDetailViewModel>()
                .ForMember(dest => dest.RelatedMovies, opt => opt.Ignore());
        }
    }
}