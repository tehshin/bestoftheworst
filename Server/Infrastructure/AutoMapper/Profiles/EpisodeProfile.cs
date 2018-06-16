using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;

namespace BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles
{
    public class EpisodeProfile: Profile
    {
        public EpisodeProfile()
        {
            CreateMap<Episode, EpisodeViewModel>();

            CreateMap<CreateEpisodeViewModel, Episode>();
        }
    }
}