using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles
{
    public class EpisodeProfile: Profile
    {
        public EpisodeProfile()
        {
            CreateMap<Episode, EpisodeViewModel>()
                .ForMember(e => e.ReleaseDate, o => o.MapFrom(_ =>
                    _.ReleaseDate.HasValue ? _.ReleaseDate.Value.ToString("yyyy-MM-dd") : null));

            CreateMap<CreateEpisodeViewModel, Episode>();

            CreateMap<Movie, EpisodeGroupViewModel.MovieInfo>();
        }
    }
}