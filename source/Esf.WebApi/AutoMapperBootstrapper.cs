using AutoMapper;
using Esf.DataAccess;
using Esf.Domain;
using Esf.WebApi.Areas.EsfQueryRunner;
using Esf.WebApi.Areas.EsfState;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Esf.WebApi
{
	public class AutoMapperBootstrapper
	{
		public static IMapper Bootstrap()
		{
			var config = new MapperConfiguration(ConfigureMappings);
			IMapper autoMapper = config.CreateMapper();
			try
			{
				config.AssertConfigurationIsValid();
				return autoMapper;
			}
			catch (Exception)
			{
				//TODO error logging
				throw;
			}
		}

		private static void ConfigureMappings(IMapperConfigurationExpression mapperConfig)
		{
			//EsfRunResponse
			mapperConfig.CreateMap<EsfQueryRunResult, EsfRunResponseDto>();
			mapperConfig.CreateMap<JsonError, JsonErrorDto>();
			mapperConfig.CreateMap<EsfError, EsfErrorDto>();

			//EsfState
			mapperConfig.CreateMap<EsState, EsfStateDto>();
			mapperConfig.CreateMap<EsState, ExistingEsfStateDto>().ConvertUsing(EsfStateConverter.FromExisting);
			mapperConfig.CreateMap<EsfStateDto, EsState>().ConvertUsing(EsfStateConverter.ToNew);
		}
	}
}