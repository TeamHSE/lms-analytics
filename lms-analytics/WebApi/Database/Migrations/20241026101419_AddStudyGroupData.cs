using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddStudyGroupData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.InsertData(
				table: "StudyGroups",
				columns: new[] { "Program", "AdmissionYear", "GroupNumber" },
				values: new object[,]
				{
					{"ПИ", 2021, 2},
					{"БИ", 2024, 3},
					{"РИС", 2022, 1},
					{"РИС", 2020, 1},
					{"РИС", 2021, 2},
					{"Э", 2020, 4},  
					{"Э", 2023, 3},  
					{"МБ", 2020, 4}, 
					{"МБ", 2022, 2}, 
					{"МБ", 2021, 4},
				});
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
